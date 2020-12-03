import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppoinmentsRepository from '../repository/AppoinmentsRepository';

const appointmentsRouter = Router();
const appoinmentsRepository = new AppoinmentsRepository();

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appoinmentsRepository.findByDate(
    parsedDate,
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appoinmentsRepository.create(provider, parsedDate);

  return response.json(appointment);
});

export default appointmentsRouter;
