export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '3em', 
        marginBottom: '20px',
        fontWeight: '600'
      }}>Welcome</h1>
      <p style={{ 
        fontSize: '1.2em',
        color: 'rgba(255, 255, 255, 0.8)',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>This is the Financial Tracker (FTR) app. More to come soon.</p>
    </div>
  )
} 