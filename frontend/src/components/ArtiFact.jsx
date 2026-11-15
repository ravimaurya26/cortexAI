import { Code2, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useSelector } from 'react-redux'
import react from 'react'
import { motion } from "motion/react"
import { useState } from 'react'

function Artifact() {
  const [collapsed, setCollapsed] = useState(false)
  const { artifacts } = useSelector(state => state.message)
  if (artifacts.length === 0) return;
  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: collapsed ? 48 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className='hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 w-[250px]'>
      {!collapsed ? <div className='flex flex-col h-full bg-[#0d0f14]'>
        <div className='flex px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 shrink-0'>
          <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
            onClick={() => setCollapsed(true)}>

            <PanelRightClose size={16} />
          </button>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0'>
              <Code2 className='text-indigo-500' size={12} />
            </div>
            <div className=' text-[13px] font-medium text-slate-200 truncate'>{artifacts[0]?.title}</div>
          </div>
          


        </div>
      </div> :
        <div className='hidden lg:flex h-full border-white/[0.06] bg-[#0d0f14] flex-col item-center py-4 gap-3 shrink-0'>
          <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
            onClick={() => setCollapsed(false)}>

            <PanelRightOpen size={16} />
          </button>
          <div className='flex items-center gap-2 flex-1 min-w-0'>

            <div className=' text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap'
              style={{ writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)'
                 }}> {artifacts[0]?.title}
            </div>
          </div>
        </div>}
    </motion.div>
  )
}
export default Artifact