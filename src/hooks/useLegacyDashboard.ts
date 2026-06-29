import { useEffect, useMemo, useRef, useState } from 'react';
import { auditPlan, qualityScore } from '../services/quality';
import { readLegacySnapshot, saveModernAutosave } from '../services/legacyAdapter';
import type { LegacySnapshot } from '../types';
export function useLegacyDashboard(){const frameRef=useRef<HTMLIFrameElement>(null); const [snapshot,setSnapshot]=useState<LegacySnapshot>({courses:[],pathways:[],deploymentLoaded:false,generatedHtml:false}); const refresh=()=>setSnapshot(readLegacySnapshot(frameRef.current)); useEffect(()=>{const id=setInterval(()=>{const s=readLegacySnapshot(frameRef.current); setSnapshot(s); saveModernAutosave(s)},15000); return()=>clearInterval(id)},[]); return {frameRef,snapshot,refresh,issues:useMemo(()=>auditPlan(snapshot),[snapshot]),score:useMemo(()=>qualityScore(snapshot),[snapshot])};}
