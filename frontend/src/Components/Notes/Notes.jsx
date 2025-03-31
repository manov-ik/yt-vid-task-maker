import {useState,useEffect} from "react"
import axios from "axios"
const Notes =(vidId) =>{

    const [notes,setNotes] = useState('')
    const [saved,setSaved] = useState(false)
    const [showDiaBox,setshowDiaBox] = useState(false)
    // const saveNotes = ()=>{
    //     const reqBody = {
    //         id:'',
    //         note_description:'',
    //         time_created:'',
    //         page_id:''
    //     }
    //     const response = await axios.post(`http://127.0.0.1:8000/${vidId}/create-note/`,
    //         {
                
    //         })
        
    
    return <section className="pb-15 px-4 relative min-w-[500px]  min-h-[350px] max-w-[600px] row-span-3 w-full col-span-2  bg-[#303030] rounded-xl ">
                 {showDiaBox && 
                    <div className="absolute rounded-xl bg-black opacity-80 inset-0 flex justify-center">
                        <div className=" flex flex-col justify-center">
                        <div className="flex flex-col p-3  w-[300px] h-[100px] bg-[#303030] rounded-xl">
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
                                        setSaved(true)

                                        setNotes(notes)
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
                 <div className="flex justify-between px-10 py-3">
                     <div className="">
                         Notes
                     </div>
                     <div className="flex gap-6">
                         <button onClick={()=>{
                            setSaved(true)
                            setshowDiaBox(false)
                         }} className="pb-1 bg-blue-500 text-white font-normal  rounded-md w-14 flex justify-center hover:bg-blue-400">
                            Save
                         </button>
                         <button onClick={()=>{
                           setshowDiaBox(true)
                         }} className="text-md text-white cursor-pointer hover:text-blue-400  hover:scale-130 duration-90 ">
                                 <svg className="w-6 h-6 fill-current text-white hover:text-blue-400" viewBox="0 0 24 24">
                                   <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                         </button>
                     </div>
                 </div>
                <textarea type="text" onChange={(e)=>{
                    
                    setNotes(e.target.value)
                    setSaved(false)
                }}placeholder="Notes....." className="p-2 w-full h-full resize-none outline-none " />
                {/* {showDiaBox && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-[#303030] p-5 rounded-lg text-white shadow-lg">
                          <p className="mb-4">You have unsaved changes. Save before adding a new note?</p>
                          <div className="flex justify-end gap-3">
                            <button className="px-3 py-1 bg-gray-600 rounded" onClick={handleCancel}>Cancel</button>
                            <button className="px-3 py-1 bg-blue-500 rounded" onClick={handleSave}>Save</button>
                          </div>
                        </div>
                      </div>
                    )} */}
           </section>
}
export default Notes