import { useState } from 'react';

type TeamMember = {
  name: string;
  photo: string;
  bio: string;
};

const teamMembers: TeamMember[] = [
  {
    name: 'Kristian Ventura / Executive Director',
    photo: '/team/KristianVentura.jpg',
    bio: `Born and raised in California, Kristian Ventura is the visionary founder of Actum, leading the organization with passion and purpose. His dedication to service has taken him around the globe, volunteering in London, the Dominican Republic, and France. From working in homeless shelters and orphanages to tutoring children, Kristian’s commitment to making a difference has earned him national recognition and prestigious commendations. A graduate of the University of Southern California with a degree in theatre, Ventura’s talents extend to the screen, with acting credits on Netflix, Paramount, HBO, ABC, and more. He believes it is our duty to confront the injustices of our time and once observed, to take decisive action for a better world without hesitation.`
  },
  {
    name: 'Surya Singh / Chief Financial Officer',
    photo: '/team/SuryaSingh.jpg',
    bio: `Born in India, Surya moved to California, USA in 2012 with his family. As he advanced through his education in computer science and career in data engineering, he developed a growing fascination for technology and its ability to improve lives. Always eager to try new things, he constantly explores ways to use technology as a tool to assist others with their projects and everyday challenges. Beyond his technical interests, Singh finds true fulfillment in helping people, believing that offering support and solving problems brings one of life’s greatest joys. With a passion for continuous learning and innovation, he strives to make a meaningful impact through his work and personal endeavors.`
  },
  {
    name: 'Edmarck Sosa / Secretary',
    photo: '/team/EdmarckSosa.jpg',
    bio: `Edmarck Sosa grew up in Los Angeles County, in the city of La Puente near a milk plant. From an early age, Sosa developed a fascination with physics and the natural phenomena that shape our universe. This curiosity and drive to understand complex systems inspired him to pursue a Bachelor’s degree in Computer Science at California State University, Fullerton, where he learned to apply analytical thinking and problem solving skills to real world challenges.`
  },
  {
    name: 'Danny Breslin / Director of Development',
    photo: '/team/DannyBreslin.jpeg',
    bio: `Danny Breslin is from Chicago, but now lives in LA after attending USC. He has served as a Hospitalier at Lourdes, and recently served school children with Parkview Christian in Kenya. He has also been volunteering at PADS through Notre Dame Church in Clarendon Hills for much of his life, and is eager to take on Actum as his biggest service project to date. His biggest passions through service are children, the environment, veterans mental health and God.`
  }
];

// Utility to split name and title
function splitNameAndTitle(full: string): { name: string; title: string } {
  const parts = full.split(' / ');
  return { name: parts[0] || full, title: parts[1] || '' };
}

export default function Team() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<TeamMember | null>(null);

  const openModal = (member: TeamMember) => {
    setModalContent(member);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className="page-content team-page">
      <div className="team-intro-text" style={{
        maxWidth: '700px',
        margin: '2.5rem auto',
        textAlign: 'justify',
        fontSize: '1.35rem',
        fontFamily: 'Georgia, serif',
        lineHeight: 1.5
      }}>
        At Actum, our team is fully volunteer-based. None of our leaders take a penny or salary for their work. Everyone on our team has their own career outside of Actum, so you know they’re here because they genuinely care about the mission. Doing good doesn’t need to come with a return—true change is its own reward. Unlike nonprofits where CEOs/staff earn salaries that tally into the hundreds of millions, the people below dedicate their time and skills because they know that a better world is worth building.
      </div>
      <h2 className="team-section-title" style={{ color: '#000', fontSize: '2.5rem', fontFamily: 'Georgia, serif', fontWeight: 400, textAlign: 'center' }}>Our Team</h2>
      <div className="team-members-row" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {teamMembers.map((member) => (
          <div
            className="team-member-card"
            key={member.name}
            onClick={() => openModal(member)}
            style={{ 
              cursor: 'pointer',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            tabIndex={0}
            role="button"
            aria-label={`Show full bio for ${member.name}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openModal(member); }}
          >
            <div
              className={`team-member-photo ${member.name.toLowerCase().split(' ')[0]}`}
              style={{ 
                backgroundImage: `url('${member.photo}')`,
                height: '300px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="team-member-info" style={{
              padding: '1.5rem'
            }}>
              {(() => {
                const { name, title } = splitNameAndTitle(member.name);
                return (
                  <>
                    <div style={{ 
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>{name}</div>
                    {title && <div style={{
                      color: '#666',
                      marginBottom: '1rem'
                    }}><b>{title}</b></div>}
                  </>
                );
              })()}
              <div style={{
                lineHeight: '1.6',
                color: '#444',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {member.bio}
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && modalContent && (
        <div className="bio-modal-overlay" onClick={closeModal}>
          <div className="bio-modal bio-modal-flex" onClick={e => e.stopPropagation()}>
            <button className="bio-modal-close" onClick={closeModal} aria-label="Close bio">&times;</button>
            <div className="bio-modal-inner">
              <div className="bio-modal-photo" style={{backgroundImage: `url('${modalContent.photo}')`}} />
              <div className="bio-modal-right">
                {(() => {
                  const { name, title } = splitNameAndTitle(modalContent.name);
                  return (
                    <>
                      <div className="bio-modal-name">{name}</div>
                      {title && <div className="bio-modal-title-job">{title}</div>}
                    </>
                  );
                })()}
                <div className="bio-modal-content">{modalContent.bio}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
