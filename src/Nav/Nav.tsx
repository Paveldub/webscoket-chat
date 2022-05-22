import { Link } from 'react-router-dom';

export const Nav: React.FC = () => {

    return (
        <>
        <h1>Nav</h1>
        <ul>
            <li>
              <Link to="/chat">Chat page</Link>
            </li>
          </ul>
        </>
    )
}