import styles from "./HomeTeam.module.scss";

const teamMembers = [
  {
    id: "jonny",
    name: "Jonny",
    role: "CEO/CTO",
    image: "/images/team/jonny.svg",
    bio: [
      "Jonny is a serial entrepreneur and is the inventor of Buttery's distributed AI systems (DAIS) technology and the core developer of ButteryAI's intelligence engines.",
      "Jonny has a passion for technology and creating things. He's crafted a scalable architecture called the Composable Architecture Pattern that enables dynamic scalable software architecture that is self-sustaining for modern programs. ButteryAI uses this architecture to support the intricate intelligence systems and distributed components.",
    ],
  },
  {
    id: "nick",
    name: "Nick",
    role: "Director of Web Development",
    image: "/images/team/nick.svg",
    bio: [
      "Nick is a serial entrepreneur and holds a bachelors in advertising and marketing. Nick ensures that ButteryAI's revolutionary technology consistently has a unique and engaging web experience.",
      "Nick has been programming since he was a teenager and brings over a decade of web development experience to his role. He's worked with healthcare and other companies delivering solid user experiences across a wide range of products. This experience is also helpful because of the handling of sensitive data, which ButteryAI takes very seriously and why E2EE encryption and compliances are so important.",
    ],
  },
  {
    id: "larissa",
    name: "Larissa",
    role: "Chief Design Officer",
    image: "/images/team/larissa.svg",
    bio: [
      "Larissa is a strong and determined businesswoman. Larissa's goal is to architect simple and engaging user experiences with world-class design so users can focus on building amazing AI and getting things done.",
      "Larissa has passion for design, art, and architecture. She's been a lead designer for a worldwide non-profit where she worked with large teams to execute on plans and deliver results on-time and in-budget. Larissa loves visiting art museums and sites built from her favorite architects.",
    ],
  },
];

const HomeTeam = () => (
  <section className={styles.root} data-section="team">
    <div className={styles.content}>
      <h1 className={styles.title}>Meet the team</h1>
      <div className={styles.team}>
        {teamMembers.map((member) => (
          <div key={member.id} className={styles.member}>
            <div className={styles.photo}>
              <img src={member.image} alt={member.name} />
            </div>
            <h2 className={styles.name}>{member.name}</h2>
            <div className={styles.role}>
              <p>Founder</p>
              <p>{member.role}</p>
            </div>
            <div className={styles.bio}>
              {member.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTeam;
