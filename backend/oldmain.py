from youtube_transcript_api import YouTubeTranscriptApi
from google import genai
import os
from dotenv import load_dotenv, dotenv_values 
load_dotenv()

video_id = "H5ujoWRyqBw" # test video
ytt_api = YouTubeTranscriptApi()
fetched_transcript = ytt_api.fetch(video_id)

text = ""

for snippet in fetched_transcript:
    text = text + snippet.text + " "

client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=text+"\n"+"the above paragraph is a transcript of a youtube video with this give me a list of tasks in the format of javascript list just a task and id no need other things so i can use it in my frontend and these tasks should be useful , if transcript not related to task kind of thing just tell me it cant be created and dont give task if the transcript is not related to task kind of thing",
)

print(response.text)