export default function Plan() {
  return (
    <div className="page-content plan-page" style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '6rem 2rem 2rem',
      fontFamily: 'Georgia, serif', 
      color: '#222'
    }}>
      <blockquote style={{ 
        fontStyle: 'italic', 
        fontSize: '1.5rem', 
        marginBottom: '3rem', 
        borderLeft: '4px solid #444', 
        paddingLeft: '1.2rem', 
        color: '#222', 
        lineHeight: 1.4 
      }}>
        "If none of us asked to be alive, why do we have to pay to be here? It's time to flip the script."<br />
        <span style={{ fontWeight: 600, display: 'block', marginTop: '0.6rem', fontSize: '1.35rem' }}>
          - Kristian Ventura, founder of actum
        </span>
      </blockquote>

      <h1 style={{ 
        fontSize: '2.7rem', 
        fontWeight: 700, 
        marginBottom: '3rem', 
        letterSpacing: '0.02em',
        textAlign: 'center'
      }}>
        OUR PLAN.
      </h1>

      {/* Section 1 - Image Right */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        marginBottom: '4rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            The Foundation
          </h2>
          <p style={{ fontSize: '1.35rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We begin with one bold act: building the very first Actum residence—where residents will live entirely free of charge. No rent. No mortgage. Just the freedom to exist without paying for a roof over your head.
          </p>
          <p style={{ fontSize: '1.35rem', lineHeight: 1.7 }}>
            Applicants will enter through a lottery system—removing power dynamics, favoritism, bureaucracy, and gatekeeping. It's unbiased justice. The application open to everyone regardless of income— followed by a basic background check to ensure the safety of the community.
          </p>
        </div>
        <img src="/plan/housingunit.jpg" alt="Sketch of a housing unit" style={{ 
          width: '100%', 
          height: 'auto',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'rotate(2deg)'
        }} />
      </div>

      {/* Section 2 - Image Left */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        marginBottom: '4rem'
      }}>
        <img src="/plan/portfolioplan.png" alt="Diagram of financial portfolio" style={{ 
          width: '100%', 
          height: 'auto',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'rotate(-1deg)'
        }} />
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            Sustainable Funding
          </h2>
          <p style={{ fontSize: '1.35rem', lineHeight: 1.7 }}>
            To make this happen—and to make it last—we're building a powerful financial engine. We are raising a foundational fund through investments, donations, and merchandise. By investing in stable market assets, our fund generates recurring returns that build new homes every year, indefinitely.
          </p>
        </div>
      </div>

      {/* Section 3 - Full Width */}
      <div style={{ 
        marginBottom: '4rem',
        textAlign: 'center'
      }}>
        <img src="/plan/merchplan.png" alt="Sketch of Actum merchandise" style={{ 
          width: '80%', 
          height: 'auto',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          margin: '0 auto 2rem'
        }} />
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          Community & Growth
        </h2>
        <p style={{ 
          fontSize: '1.35rem', 
          lineHeight: 1.7,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Once the first Actum residence is complete, we expand. More buildings, more cities, more people—all selected by lottery. No discrimination. No income barriers. Just access. Actum will then plant seeds of universal housing to other countries across the earth.
        </p>
      </div>

      {/* Closing Section */}
      <div style={{ 
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        padding: '3rem',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <p style={{ 
          fontSize: '1.5rem', 
          lineHeight: 1.6,
          fontStyle: 'italic',
          marginBottom: '1.5rem'
        }}>
          "We are working toward a world where free housing is not a make-believe dream, but a birthright."
        </p>
        <div style={{ textAlign: 'center' }}>
          <img src="/plan/earthsketch.jpg" alt="Sketch of earth" style={{ 
            width: '60%', 
            height: 'auto',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }} />
        </div>
      </div>
    </div>
  );
}
