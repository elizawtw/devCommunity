import React, { useState, useContext, useEffect } from 'react';
import Devcommunity from '../apis/Devcommunity';
import { EventsContext } from '../context/EventsContext';

const EventsList = (props) => {
  const {events, setEvents} = useContext(EventsContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Devcommunity.get("/events");
        
        setEvents(response.data);
        
      } catch (err) {
        
      }
    }
    fetchData();
  }, [])
  
  return (
    <div>


      <div className="list-group">
        <table className="table table-hover table-dark">
          <thead>
            <tr className="bg-primary">
              <th scope="col" >Name</th>
              <th scope="col" >Description</th>
              <th scope="col" >Date</th>
            </tr>
          </thead>
          <tbody>

            {events.map(elem => (
              
                <tr key={elem.id}>
                  <td >
                  <img src={elem.photo} className="img-fluid" alt="Responsive image"></img>
                    {elem.name}
                  </td>
                  <td >
                    {elem.description}
                  </td>
                  <td >
                    {elem.date}
                  </td>
                </tr>

              
            ))}
            <tr>

            </tr>
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default EventsList;