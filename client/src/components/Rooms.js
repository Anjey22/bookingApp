import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { parse, isBefore, startOfToday } from 'date-fns';
import Swal from 'sweetalert2';
 // Rooms style in homescreen.css

function Rooms({ room, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBookNow = () => {
    const today = startOfToday();
    const fromDateObj = fromdate ? parse(fromdate, 'MM-dd-yyyy', new Date()) : null;
    const toDateObj = todate ? parse(todate, 'MM-dd-yyyy', new Date()) : null;

    if (!fromdate || !todate || isBefore(fromDateObj, today) || isBefore(toDateObj, today)) {
      Swal.fire('', 'Please choose valid dates first');
      return;
    }

    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in or register first before booking.");
      return;
    }

    // Redirect to booking page with selected dates
    window.location.href = `/booking/${room._id}/${fromdate}/${todate}`;
  };

  return (
    

    <div className="room-card">
      <div className="room-image m-3">
        <img src={room.imageurl[0]} alt="Room" />
      </div>
      <div className="room-details">
        <b><h1>{room.name}</h1></b>
        <hr></hr>
        <b>
          <p>Max Count: {room.maxcount}</p>
          <p>Phone Number: {room.phone}</p>
          <p>Room Type: {room.roomtype}</p>
        </b>
        <div className="view-details">
          <button className="btn btn-primary" onClick={handleBookNow}>Book Now</button>
          <button className="btn btn-primary" onClick={handleShow}>View Details</button>
        </div>
      </div>


      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurl.map((url, index) => (
              <Carousel.Item key={index}>
                <img src={url} alt="room" className="d-block w-100 roomsimg my-2" />
              </Carousel.Item>
            ))}
          </Carousel>
          <b><p>Room Price: {room.rentprice}</p></b>
          <p><b>Location: </b>View on <a href={room.maps} target="_blank"><b>Maps</b></a></p>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Rooms;
