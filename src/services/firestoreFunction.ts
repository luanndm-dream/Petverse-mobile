import firestore from '@react-native-firebase/firestore';

export const addAppointmentInBreedingToFirestore = async (
    appointmentId: string,
    userId: string,
    petId: string,
  ) => {
    try {
      await firestore().collection('inbreeding').doc(appointmentId).set({
        userId,
        petId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Appointment added to Firestore successfully!');
    } catch (error) {
      console.error('Error adding appointment to Firestore:', error);
    }
  };
