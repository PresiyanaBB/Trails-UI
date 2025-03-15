import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import ArtistComponent from './components/artist/ArtistComponent'
import ProjectComponent from './components/project/ProjectComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateArtistComponent from './components/artist/CreateArtistComponent'
import CreateProjectComponent from './components/project/CreateProjectComponent'
import '../src/styles/common.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path="/artists" element={<ArtistComponent />} />
          <Route path="/admin/add-artist" element={<CreateArtistComponent />} />
          <Route path="/gallery" element={<ProjectComponent />} />
          <Route path="/admin/add-project" element={<CreateProjectComponent />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter >
    </>
  )
}

export default App
