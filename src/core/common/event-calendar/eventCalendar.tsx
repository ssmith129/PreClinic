import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ImageWithBasePath from "../../imageWithBasePath";

const EventCalendar = () => {
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const events = [
    {
      image: "assets/img/users/user-01.jpg",
      start: new Date(Date.now() - 168000000).toISOString().slice(0, 10),
    },
    {
      image: "assets/img/users/user-02.jpg",
      start: new Date(Date.now() + 338000000).toISOString().slice(0, 10),
    },
    {
      image: "assets/img/users/user-03.jpg",
      start: new Date(Date.now() - 338000000).toISOString().slice(0, 10),
    },
    {
      image: "assets/img/users/user-04.jpg",
      start: new Date(Date.now() + 68000000).toISOString().slice(0, 10),
    },
    {
      image: "assets/img/users/user-05.jpg",
      start: new Date(Date.now() + 88000000).toISOString().slice(0, 10),
    },
  ];

  const renderEventContent = (eventInfo: any) => {
    const { image } = eventInfo.event.extendedProps;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {image && (
          <span
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
            }}
          >
            <ImageWithBasePath
              src={image}
              alt="icon"
              className="avatar-xs rounded-circle"
            />
          </span>
        )}
      </div>
    );
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        ref={calendarRef}
      />

      {selectedEvent && (
        <div
          className={`modal fade ${modalOpen ? "show d-block" : ""}`}
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
           onClick={closeModal} 
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-dark modal-bg">
                <h5 className="modal-title text-white">
                  {selectedEvent.title || "Team B"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p className="d-flex align-items-center fw-medium text-black mb-3">
                  <i className="ti ti-calendar-check text-default me-2" />
                  26 Jul,2024 to 31 Jul,2024
                </p>
                <p className="d-flex align-items-center fw-medium text-black mb-3">
                  <i className="ti ti-calendar-check text-default me-2" />
                  11:00 AM to 12:15 PM
                </p>
                <p className="d-flex align-items-center fw-medium text-black mb-3">
                  <i className="ti ti-map-pin-bolt text-default me-2" />
                  Las Vegas, US
                </p>
                <p className="d-flex align-items-center fw-medium text-black mb-0">
                  <i className="ti ti-calendar-check text-default me-2" />A
                  recurring or repeating event is simply any event that you will
                  occur more than once on your calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
