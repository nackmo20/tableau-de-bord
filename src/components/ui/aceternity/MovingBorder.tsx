import type { ReactNode } from 'react';
export function MovingBorder({children,className=''}:{children:ReactNode;className?:string}){return <div className={`relative rounded-2xl p-[1px] bg-gradient-to-r from-slate-200 via-blue-300 to-slate-200 ${className}`}><div className="rounded-2xl bg-white/90 p-4">{children}</div></div>}
