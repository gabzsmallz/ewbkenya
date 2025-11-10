export const defaultTeamMembers = [
  {
    name: 'Jane Mwangi',
    role: 'Program Director',
    image:
      'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop',
    bio: 'Leads our strategic partnerships and community co-design efforts.',
  },
  {
    name: 'David Otieno',
    role: 'Lead Engineer',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop',
    bio: 'Guides project engineering standards and volunteer mentorship.',
  },
  {
    name: 'Aisha Njeri',
    role: 'Community Liaison',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    bio: 'Builds strong relationships with local leaders and project teams.',
  },
  {
    name: 'Peter Kimani',
    role: 'Innovation Fellow',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    bio: 'Explores emerging technologies that support resilient communities.',
  },
];

export const createDefaultTeamMembers = () =>
  defaultTeamMembers.map((member) => ({ ...member }));
