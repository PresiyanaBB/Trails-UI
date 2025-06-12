import '../../styles/home/three-circles.css'
import pinkGirl from '/three-circles-images/pink-girl.png'
import yellowBoy from '/three-circles-images/yellow-boy.png'
import orangeGirl from '/three-circles-images/orange-girl.png'

function ThreeCirclesComponent() {
    return (
        <div className="three-circles-container">
            <div className="circle">
                <img src={pinkGirl} alt="Pink Girl" />
            </div>
            <div className="circle">
                <img src={yellowBoy} alt="Yellow Boy" />
            </div>
            <div className="circle">
                <img src={orangeGirl} alt="Orange Girl" />
            </div>
        </div>
    );
}

export default ThreeCirclesComponent;