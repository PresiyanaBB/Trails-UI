import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import ArtistComponent from './components/ArtistComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateArtistComponent from './components/CreateArtistComponent'
import '../src/styles/common.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path="/artists" element={<ArtistComponent />} />
          <Route path="/admin/add-artist" element={<CreateArtistComponent />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter >
    </>
  )
}

export default App
