import type { LegacyCourse, LegacySnapshot } from '../types';
export function readLegacySnapshot(frame: HTMLIFrameElement | null): LegacySnapshot {
  const win = frame?.contentWindow as (Window & Record<string, any>) | null;
  if (!win) return empty();
  const candidates = ['courses','intentions','planCourses','data'];
  const courses = candidates.map((k)=>win[k]).find(Array.isArray) as LegacyCourse[] | undefined;
  const pathways = (['composedCourses','parcoursComposes','pathways'].map((k)=>win[k]).find(Array.isArray) ?? []) as unknown[];
  const doc = frame?.contentDocument ?? undefined;
  return {courses: courses ?? [], pathways, planTitle: text(doc,'plan-title'), deploymentLoaded: !!text(doc,'excel-file-info'), generatedHtml: !!((doc?.getElementById('comm-rawCode') as HTMLTextAreaElement | null)?.value || doc?.getElementById('comm-visualEditor')?.textContent), lastSavedAt: localStorage.getItem('ovp-modern-autosave-at') ?? undefined};
}
function text(doc: Document | undefined, id:string){return doc?.getElementById(id)?.textContent?.trim() || undefined}
function empty(): LegacySnapshot{return {courses:[],pathways:[],deploymentLoaded:false,generatedHtml:false}}
export function saveModernAutosave(snapshot:LegacySnapshot){localStorage.setItem('ovp-modern-autosave',JSON.stringify({version:2,savedAt:new Date().toISOString(),snapshot}));localStorage.setItem('ovp-modern-autosave-at',new Date().toLocaleString('fr-FR'))}
export function clickLegacy(frame:HTMLIFrameElement|null,id:string){const el=frame?.contentDocument?.getElementById(id) as HTMLElement | null;el?.click();}
export function switchLegacyTab(frame:HTMLIFrameElement|null,tab:string){const win=frame?.contentWindow as any; if(typeof win?.switchTab==='function') win.switchTab(tab); else frame?.contentDocument?.getElementById(`tab-${tab}`)?.scrollIntoView({behavior:'smooth'});}
