import { getSheets } from '../../utils/googleSheets';
import { SupabaseClient } from '@supabase/supabase-js';
const admin = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const {fullName,email,phone,skills,interestAreas}=req.body||{};
  if(!fullName||!email) return res.status(400).json({error:'Missing required fields'});
  const { error:dbErr } = await admin.from('members').insert({ full_name:fullName, email, phone, skills, interest_areas:interestAreas });
  if(dbErr) return res.status(500).json({error:dbErr.message});
  try{
    const sheets=await getSheets();
    await sheets.spreadsheets.values.append({ spreadsheetId:process.env.GSHEETS_SPREADSHEET_ID, range:'Members!A1', valueInputOption:'USER_ENTERED', requestBody:{ values:[[new Date().toISOString(),fullName,email,phone||'',skills||'',interestAreas||'']] } });
  }catch(e){ console.error('Sheets append failed',e); }
  res.status(200).json({ok:true});
}
