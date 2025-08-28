import { Link, useSearchParams } from 'react-router-dom'

export default function RegistrationSuccess() {
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username') || 'User'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3em',
          marginBottom: '20px',
          fontWeight: '600',
        }}
      >
        Registration Successful!
      </h1>
      <p
        style={{
          fontSize: '1.2em',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '600px',
          lineHeight: '1.6',
        }}
      >
        User <strong>{username}</strong> has been created.
      </p>
      <p
        style={{
          fontSize: '1.2em',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '600px',
          lineHeight: '1.6',
        }}
      >
        <Link to="/login">Navigate here to login</Link>
      </p>
    </div>
  )
}
