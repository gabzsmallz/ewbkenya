import { SupabaseClient } from '@supabase/supabase-js'; import { getSheets } from '../../utils/googleSheets';
const admin = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { projectId, message } = req.body||{};
  if(!projectId) return res.status(400).json({error:'Missing projectId'});
  const { error:dbErr } = await admin.from('project_signups').insert({ project_id:projectId, profile_id:null, message });
  if(dbErr) return res.status(500).json({error:dbErr.message});
  try{
    const sheets=await getSheets();
    await sheets.spreadsheets.values.append({ spreadsheetId:process.env.GSHEETS_SPREADSHEET_ID, range:'Signups!A1', valueInputOption:'USER_ENTERED', requestBody:{ values:[[new Date().toISOString(), projectId, message||'']] } });
  }catch(e){ console.error('Sheets append failed', e); }
  res.status(200).json({ok:true});
}
