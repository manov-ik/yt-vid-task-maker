import {useState,useEffect} from "react"
import axios from "axios"
import {motion} from "framer-motion"
import Notes from "../Components/Notes/Notes"
const Home = ()=>{
    const [url,setUrl] = useState('');
    const [vidUrl,setVidUrl] = useState();
    const [loading,setLoading] = useState(true)
    const [tasks,setTasks] = useState([]);
    const [completed,setCompleted] =useState(0)
    
    const toggleTask =(e)=>{
        setCompleted((prev) => (e.target.checked? prev+1:prev-1))
    }
    let vidId= '';
    const progress =(completed/tasks.length)*100
    const fetch = async() => {
        await axios.post("http://127.0.0.1:8000/create-page/?vid_url="+url).then((response)=>{
            if(response.data.vid_id){
                vidId=(response.data.vid_id)
                console.log(response.data)
                setVidUrl('https://www.youtube.com/embed/'+vidId)
                setLoading(false)
                console.log("vidId is here babe")
            }else{
                console.log("no vid_id")
                console.log(response.data)
            }
        })
       
       await axios.get(`http://127.0.0.1:8000/${vidId}/get-tasks`).then((response)=>{
        console.log("get vidid")    
        if(response.data){
                setTasks(response.data)
                console.log(response.data)
            }
       })
       
    }
    
    return <div className=" bg-black  w-full text-[#006A67] min-h-full ">
        <div className="p-10 min-h-30 ">
            <div class=" h-10 max-w-full rounded-full flex justify-between min-w-[600px]">
                 <span className="font-bold tracking-[1px] text-[#006A67] text-2xl ml-10 align-bottom flex flex-col h-9 justify-center">
                    ChatGpt
                 </span>
                 
                 <div className="flex mr-10 mt-2">
                    <div className="mr-3 max-w-20">
                        SignUp
                    </div>
                    <div className="w-15">
                        Prof Pic
                    </div>
                 </div>
            </div>
        </div>
        <main className="flex justify-center">
            <section className=" flex flex-col w-[80%] min-h-screen">
              <section className="pb-10 flex  gap-4">
                {/* //<div className="grid grid-cols-5 h-full"> */}
                    <section className=" w-full min-h-[400px] min-w-[300px] bg-[#303030]  rounded-xl ">
                        <iframe src={vidUrl} className="w-full h-full rounded-xl " frameBorder="0" allowFullScreen>
                            
                        </iframe>
                    </section>
                    <div className="max-w-[600px] w-full flex flex-col gap-2  break-words">
                        <section className="p-5   bg-[#303030] rounded-xl" > 
                            <div className="flex  justify-between items-center ">
                                <div className="text-blue-500 text-xl font-semibold mb-5 ">
                                    Progress :
                                </div>
                                <div className="text-blue-500 font-medium">
                                    {progress}%
                                </div>
                            </div>
                            <div className="w-full  bg-gray-200 rounded-full h-2.5 mb-3 ">
                               <motion.div
                                 className="bg-blue-600 h-2.5 rounded-full"
                                 animate={{ width: `${progress}%` }}
                                 transition={{ duration: 0.5, ease: "easeInOut" }}
                               ></motion.div>
                             </div>
                        </section>
                        <section className="h-full ">
                            <Notes  />
                        </section>
                    </div>
                 </section>
                    <section className=" rounded-2xl border-[#303030] border-1 min-w-[600px] px-1 ">
                       <div className="flex px-10 py-3 justify-between">
                            <div className="text-2xl font-bold text-white pt-1 tracking-wider border-b-1 border-[#303030]">
                                Tasks 
                            </div>
                            
                        </div>
                        { tasks && 
                            tasks.map((obj,index)=>{
                                return <motion.div key={index} className="p-2 rounded-xl  " 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}>
                                    <div  className=" flex items-center bg-[#0a0a0a] py-2 rounded-full border-1 border-[#303030] " >
                                        <input type="checkbox" onChange={toggleTask} className={`mx-5 text-white w-4 h-4  border-1 border-black rounded bg-gray-200 `}></input>
                                        <div className="mb-1  tracking-wide text-white">{obj.task_description}</div>
                                </div>
                                </motion.div>
                            })
                        }
                    </section>
                    
                {/* </div> */}
            </section>
            <div className="fixed left-2/6 right-2/6 top-5/6">
              
                <div className="h-25 flex flex-col p-2  bg-black min-w-[500px] md:max-w-[700px] rounded-4xl flex flex-wrap">
                    <textarea type="text"  placeholder="Search" onChange={(e)=>{
                        let Eurl = e.target.value.trim();
                        console.log(url+'22')
                        if(Eurl){
                            setUrl(Eurl);
                        }
                    }}className="outline-none whitespace-normal rounded-4xl w-[400px] p-5 max-h-30   resize-none custom-scrollbar"/>
                    <div type="button" onClick={()=>{
                        fetch()
                        
                    }}
                    className="cursor-pointer mt-5 border-2 rounded-full w-8 h-8 flex justify-center items-center">
                        <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </div>
               

            </div>
        </main>
        
    </div>
}
export default Home ;