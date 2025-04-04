import {useState,useEffect} from "react"
import axios from "axios"
import {motion} from "framer-motion"
import {toast} from "sonner"
const Notes =({vidId}) =>{
    const [notes,setNotes] = useState('')
    const [saved,setSaved] = useState(false)
    const [showDiaBox,setshowDiaBox] = useState(false)
    const [showList ,setshowList] = useState(false)
    const [reqBody,setReqBody] = useState({})
    const [notesList,setnotesList] = useState([])
    // const [selectedNote,setSelectedNote] = useState()
    const [vidid,setvidid] = useState(vidId) 
    console.log(vidId)
    
   console.log(showList+' up here bruh')
    const getNotesList = async()=>{
       try{
        const response = await axios.get(`http://127.0.0.1:8000/${vidId}/get-notes`)  
        if(response.data){
            setnotesList(response.data)
            setshowList(!showList)
        }else{
            setnotesList([])
            console.log("notes list problems boy-aah")
        }}
        catch(error){
            console.log("Error getting notes")
            toast.info("hi i am error")
        }
    }
    
    const deleteNotes= async (noteId)=>{
        const response = await axios.delete(`http://127.0.0.1:8000/delete-note/${noteId}`)
        console.log(response.data.id, noteId)
        if(response.data && response.data.id == noteId){
            console.log("note deleted successfully")
            setnotesList((prev)=>prev.filter((note)=> note.id !== noteId))
        }else{
            console.log("error in deleting note")
        }
    }
    console.log(reqBody)
    const saveNotes = async ()=>{
        let newReqBody = {
            id : reqBody.id || '',
            note_description : notes,
            time_created : reqBody.time_create || '',
            page_id: reqBody.page_id || ''
        }
        let response;

        if (!reqBody.id) {
            response = await axios.post(`http://127.0.0.1:8000/${vidId}/create-note/`, newReqBody);
        } else if (newReqBody.note_description !== '') {
            response = await axios.put(`http://127.0.0.1:8000/update-note/${reqBody.id}`, newReqBody);
        } else {
            console.log("Note description is empty. No request sent.");
            return null; // No update performed
        }

        if (response?.data) {
            console.log(response.data);
            setReqBody(response.data);
            return response; // Return response for promise handling
        } else {
            console.log("Error in note processing");
            return null;
        }
    }
 
   
    const getNote = (noteid)=>{
    const note = notesList.find((note)=>(
            note.id === noteid
        )   
        )
        if(note){
            setReqBody(note)
            console.log(note.note_description)
            setNotes(note.note_description)
            console.log(note.note_description)
        }
     setshowList(!showList)
     setNotes(note.note_description)
    }
        
    
    
   
    return <motion.section 
            initial={{ height: "282px" }} // Initial height
            animate={{ height: (showList && notesList.length>0) ? "50px" : "282px" }} // Animate height
            transition={{ duration: 0.6 }} // Animation duration
            className={`relative  flex flex-col  bg-[#303030] rounded-xl `}>
                 {showDiaBox && 
                    <div className="p-4 absolute rounded-xl min-w-[300px] bg-black opacity-80 inset-0 flex justify-center">
                        <div className=" flex flex-col justify-center">
                        <div className="flex flex-col p-3 justify-between h-[100px] bg-[#303030] rounded-xl">
                            <div className="text-white ">
                                You have unsaved changes.Save before adding a new note?
                            </div>
                            <div className="flex justify-end items-center gap-3 text-md ">
                                <div onClick={()=>{
                                    setshowDiaBox(false)
                                }}className="cursor-pointer hover:bg-gray-500 flex justify-center w-[60px] bg-gray-600 h-[26px] rounded text-white">
                                    Cancel
                                </div>
                                <div onClick={()=>{
                                    if(notes && saved==false){
                                        setNotes('')
                                        saveNotes()
                                    }else if(saved == true){
                                        setNotes('')
                                    }
                                    setshowDiaBox(false)
                                }}className="bg-blue-500 hover:bg-blue-600 w-[50px] flex justify-center rounded h-[26px] text-white cursor-pointer">
                                    Save
                                </div>
                            </div>
                         </div>
                        </div>
                    </div>
                 }
                 <div className={`flex justify-between px-10 py-3 ${showList?"mb-2":""} `}>
                     <div className="text-blue-500 font-bold text-xl ">
                         Notes
                     </div>
                     <div className="flex gap-4">
                        <button className="bg-blue-500 rounded px-1 hover:bg-blue-400 cursor-pointer"
                            onClick={()=>{
                                getNotesList()
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-white">
                              <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z" clipRule="evenodd" />
                            </svg>
                        </button>
                         <button onClick={()=>{
                            if(!saved && notes!=''){
                                saveNotes().then((response)=>{
                                    if(response.status==200)
                                    setSaved(true)
                                })
                                
                            }
                         }} className={`pb-1 bg-blue-500 text-white cursor-pointer font-medium  rounded-md w-14 flex justify-center ${!saved && "hover:bg-blue-400" }`}>
                            {saved? ('Saved') : ('Save')}
                         </button>
                         <button onClick={()=>{
                            if(!saved){
                                setshowDiaBox(true)
                            }else{
                                setReqBody({})
                                setNotes('')
                            }
                         }} className="text-md text-white cursor-pointer hover:text-blue-400  hover:scale-130 duration-90 ">
                                 <svg className="w-6 h-6 fill-current text-white hover:text-blue-400" viewBox="0 0 24 24">
                                   <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                         </button>
                         
                     </div>
                 </div>
            {(!showList||notesList.length==0) ?(<textarea type="text" value={notes} onChange={(e)=>{
                    
                    setNotes(e.target.value)
                    setSaved(false)
                }}placeholder="Notes . . . ." className="p-4 w-full  text-white min-h-[200px] resize-none outline-none " />)
                :(
               <motion.div className="h-[225px] w-full flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8 , delay:0.4 }}
               >
                <div
                    className=" w-full p-4 flex flex-col  justify-center border-1 overflow-y-auto border-[#303030] bg-black rounded-xl overflow-hidden">
                        <div 
                         style={{
                            /* Custom Scrollbar (WebKit) */
                            "::-webkit-scrollbar": {
                              width: "8px",
                            },
                            "::-webkit-scrollbar-track": {
                              background: "#1a1a1a",
                            },
                            "::-webkit-scrollbar-thumb": {
                              background: "#555",
                              borderRadius: "4px",
                            },
                            /* Custom Scrollbar (Firefox) */
                            scrollbarWidth: "thin",
                            scrollbarColor: "#555 #1a1a1a",
                          }}
                        className="border py-2 max-h-[450px] border-[#303030] divide-y divide-[#303030]  overflow-y-auto rounded-xl p-2 ">
                        {/* {notesList?
                        (setshowList(!showList))
                        : */}
                        {notesList && notesList?.map((note,index)=>{
                            return <motion.div key={note.id} className="" 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}>
                            <div  className="flex  justify-between  border-[#303030]" >
                                <div className="mb-1 tracking-wide text-white">awknkdaw</div>
                                <div className="flex gap-2">
                                    <svg onClick={()=>{
                                        getNote(note.id)
                                        console.log(note.id)
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-gray-400 hover:text-[#303030] m-1 p-1 cursor-pointer">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                    <svg onClick={()=>{
                                        const noteitem = notesList.find((noteobj)=>(noteobj.id === note.id))
                                        if(noteitem.note_description != ''){
                                            setNotes('')
                                        }
                                        setReqBody({})
                                        setSaved(false)
                                        deleteNotes(note.id)
                                    }} 
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer text-red-500 hover:bg-[#303030] hover:rounded-md m-1 p-1">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>

                            </div>
                            </motion.div>
                        })}
                        </div>
                    </div>

                </motion.div>
                )
                
            }
           </motion.section>
}
export default Notes