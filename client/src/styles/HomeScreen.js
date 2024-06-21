import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rooms from '../components/Rooms';
import Loading from '../components/loading';
import Error from '../components/Error';
import { DateRange } from 'react-date-range';
import Swal from 'sweetalert2';
import { format, parse, isBefore, startOfToday, isWithinInterval } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './homescreen.css';

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [datesSelected, setDatesSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomType, setRoomType] = useState('All');
  const [datePickerExpanded, setDatePickerExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/rooms/getallrooms');
        setRooms(response.data);
        setDuplicateRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (ranges) => {
    const startDate = ranges.selection.startDate;
    const endDate = ranges.selection.endDate;
    const today = startOfToday();

    if (startDate && endDate) {
      if (isBefore(startDate, today) || isBefore(endDate, today)) {
        Swal.fire('', 'Please choose valid dates');
        return;
      }

      const formattedFromdate = format(startDate, 'MM-dd-yyyy');
      const formattedTodate = format(endDate, 'MM-dd-yyyy');
      setFromdate(formattedFromdate);
      setTodate(formattedTodate);
      setDateRange([ranges.selection]);
      setDatesSelected(true);

      filterRooms(formattedFromdate, formattedTodate, searchQuery, roomType);
    } else {
      setDatesSelected(false);
      setRooms(duplicateRooms); // Reset to all rooms if no dates are selected
    }
  };

  const filterRooms = (fromDate, toDate, query, type) => {
    let filteredRooms = duplicateRooms;

    if (query.trim() !== '') {
      filteredRooms = filteredRooms.filter(room =>
        room.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type !== 'All') {
      filteredRooms = filteredRooms.filter(room => room.roomtype === type); // Correct key: roomtype
    }

    filteredRooms = filteredRooms.filter((room) => {
      const bookings = room.currentbooking;
      if (bookings.length === 0) {
        return true;
      }

      for (let i = 0; i < bookings.length; i++) {
        const bookingStart = parse(bookings[i].fromdate, 'MM-dd-yyyy', new Date());
        const bookingEnd = parse(bookings[i].todate, 'MM-dd-yyyy', new Date());

        if (isWithinInterval(parse(fromDate, 'MM-dd-yyyy', new Date()), { start: bookingStart, end: bookingEnd }) ||
            isWithinInterval(parse(toDate, 'MM-dd-yyyy', new Date()), { start: bookingStart, end: bookingEnd })) {
          return false;
        }
      }

      return true;
    });

    setRooms(filteredRooms);
  };

  const handleBookNow = () => {
    if (!datesSelected) {
      alert("Please choose dates first.");
      return;
    }

    const queryParams = `?fromdate=${fromdate}&todate=${todate}`;
    window.location.href = `/booking${queryParams}`;
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterRooms(fromdate, todate, query, roomType); // Reapply filtering after search
  };

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setRoomType(type); // Update roomType state with the selected value
    filterRooms(fromdate, todate, searchQuery, type); // Reapply filtering after room type change
  };

  const toggleDatePicker = () => {
    setDatePickerExpanded(!datePickerExpanded);
  };

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    
    <div className="homescreen-container">

      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search rooms"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="date-range-container">
          <div className="date-range-toggle" onClick={toggleDatePicker}>
            {datesSelected ? `${fromdate} - ${todate}` : 'Select Date Range'}
          </div>
          <div className={`date-range-picker ${datePickerExpanded ? 'expanded' : 'collapsed'}`}>
            <DateRange
              ranges={dateRange}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              rangeColors={['#3d91ff']}
              editableDateInputs={false}
              showMonthAndYearPickers={true}
            />
          </div>
        </div>
        <div className="filter-container">
          <select value={roomType} onChange={handleRoomTypeChange}>
            <option value="All">All</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Non Deluxe">Non Deluxe</option>
          </select>
        </div>
        <div className='details'>
      {datesSelected && (
        <div className="selected-dates">
          <p><strong>{rooms.length}</strong> availlable rooms on these dates</p>
          <br></br>
          <p><strong>Start:</strong> {fromdate} - <strong>End:</strong> {todate}</p>
        </div>
      )}
      </div>
      </div>

      <div className="rooms-container">
        {rooms.map(room => (
          <Rooms key={room._id} room={room} fromdate={fromdate} todate={todate} />
        ))}
      </div>

    </div>
  );
};

export default Homescreen;
