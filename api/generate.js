export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  // Extract business and goal from prompt
  let businessMatch = /Business: (.*)/.exec(prompt);
  let goalMatch = /Goal: (.*)/.exec(prompt);
  const business = businessMatch ? businessMatch[1].trim() : '';
  const goal = goalMatch ? goalMatch[1].trim() : '';
  const text = `Email 1: Hello! We're in the ${business} business and our aim is to ${goal}.

Email 2: This is another outreach message tailored to ${goal}.

Generic social media DM: Hi! We're in ${business} and we're looking to ${goal}.

Facebook DM: Hey! As a ${business} pro, let's ${goal}.

SMS: ${goal} with ${business}.

Video Script: Hi, we're in the ${business} industry and we're here to ${goal}.`;
  return res.status(200).json({ text });
}
