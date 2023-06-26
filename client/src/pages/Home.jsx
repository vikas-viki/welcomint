import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div>
        <h1>Hey Welcomint!</h1>
        <Link to="/mint">
          Mint
        </Link>
    </div>
  )
}

export default Home