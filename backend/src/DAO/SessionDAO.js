import mongoose from 'mongoose';

export default class GameDAO {
  static async removeSession(sessionId) {
    let collection = mongoose.connection.db.collection('sessions');

    collection.deleteOne({ _id: sessionId });
  }
}
