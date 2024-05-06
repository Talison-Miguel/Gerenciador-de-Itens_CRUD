import { useEffect, useState } from "react"

import { Header } from "./components/Header"
import { List } from "./components/List"
import { Footer } from "./components/Footer"

function App() {
    const [ data, setData ] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/rows')
            .then(response => response.json())
            .then(data => setData(data)) 
    }, [])

    return (
        <>
            <Header data={data} setData={setData}/>
            <main>
                <List data={data} setData={setData}/>
            </main>
            <Footer />
        </>
    )
}

export default App
