<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use mysql_xdevapi\Exception;
use function Symfony\Component\Console\Input\isArray;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        if (isset($data['image']))
        {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $survey = Survey::create($data);
        foreach ($data['questions'] as $question)
        {
            $this->createQuestion($survey->id, $question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id)
        {
            return abort(403, 'unauthorised');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();
        if (isset($data['image']))
        {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            if ($survey->image)
            {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }
        $survey->update($data);

        //get existing questions
        $existing = $survey->questions()->pluck('id')->toArray();

        //get new questions
        $new = Arr::pluck($data['questions'], 'id');

        //get to delete questions
        $toDelete = array_diff($existing, $new);

        //get to add questions
        $toAdd = array_diff($new, $existing);

        //delete questions
        SurveyQuestion::destroy($toDelete);

        //add questions
        foreach ($data['questions'] as $question)
        {
            if (in_array($question['id'], $toAdd))
                $this->createQuestion($survey->id, $question);
        }

        //update existing questions
        $questionsMap = collect($data['questions'])->keyBy('id');

        foreach ($survey->questions as $question)
        {
            if (isset($questionsMap[$question->id]))
                $this->updateQuestion($question, $questionsMap[$question->id]);
        }

        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id)
        {
            return abort(403, 'unauthorised');
        }
        $survey->delete();
        if($survey->image)
        {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }
        return response('', 204);
    }

    private function saveImage($image)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type))
        {
            $image = substr($image, strpos($image, ',') + 1);

            $type = strtolower($type[1]);

            if (!in_array($type, ['png', 'jpg', 'jpeg', 'gif']))
                throw new \Exception('Invalid image type');

           $image = str_replace(' ', '+', $image);
           $image = base64_decode($image);

           if ($image === false)
               throw new \Exception('Invalid image');

        }
        else
            throw new \Exception('Invalid image');

        $file = Str::random() . '.' . $type;
        $dir = 'images/';
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath))
            File::makeDirectory($absolutePath, 0755, true);

        file_put_contents($relativePath, $image);

        return $relativePath;

    }

    private function createQuestion($surveyId, $question)
    {
        $question['survey_id'] = $surveyId;
        if (is_array($question['data'])){
            $question['data'] = json_encode($question['data']);
        }

        $validator = Validator::make($question, [
           'question' => 'required|string',
           'description' => 'nullable|string',
           'data' => 'present',
           'type' => ['required', Rule::in([Survey::TYPE_TEXT, Survey::TYPE_CHECKBOX, Survey::TYPE_RADIO, Survey::TYPE_SELECT, Survey::TYPE_TEXTAREA])],
            'survey_id' => 'exists:surveys,id'
        ]);

        SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion($question, $data)
    {
        if (is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'description' => 'nullable|string',
            'data' => 'present',
            'type' => ['required', Rule::in([Survey::TYPE_TEXT, Survey::TYPE_CHECKBOX, Survey::TYPE_RADIO, Survey::TYPE_SELECT, Survey::TYPE_TEXTAREA])],
        ]);

        $question->update($validator->validated());
    }
}
