import { createClient } from '@supabase/supabase-js'; import { google } from 'googleapis';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { fullName, email, phone, skills, interestAreas } = req.body||{}; if(!fullName||!email) return res.status(400).json({error:'Missing required fields'});
  const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE,{auth:{persistSession:false}});
  const { error:dbErr } = await admin.from('members').insert({ full_name:fullName, email, phone, skills, interest_areas:interestAreas }); if(dbErr) return res.status(500).json({error:dbErr.message});
  try{
    const auth = new google.auth.GoogleAuth({ credentials:{ client_email:process.env.GSHEETS_CLIENT_EMAIL, private_key:(process.env.GSHEETS_PRIVATE_KEY||'').replace(/\\n/g,'\n') }, scopes:['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version:'v4', auth });
    await sheets.spreadsheets.values.append({ spreadsheetId:process.env.GSHEETS_SPREADSHEET_ID, range:'Members!A1', valueInputOption:'USER_ENTERED', requestBody:{ values:[[new Date().toISOString(), fullName, email, phone||'', skills||'', interestAreas||'']] } });
  }catch(e){}
  res.status(200).json({ok:true});
}
