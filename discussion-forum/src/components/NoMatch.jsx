import { Link } from "react-router-dom"
import '../App.css'

const NoMatch = () => {

    return(
        <div>
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>The page you are looking for doesn't exist.</p>
            <p>Go to <Link to={'/topics'}>Home page</Link></p>
        </div>
    )
}

export default NoMatch