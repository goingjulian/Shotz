import ShotzException from "../exceptions/ShotzException";
import GameDAO from "../DAO/GameDao";

export async function checkAuthentication(sessionRoomKey, sessionRole, roomKey, allowedRoles) {
  const roomKeyStatus = sessionRoomKey == roomKey;
  const roleStatus = allowedRoles.includes(sessionRole);
  console.log("CHECK");
  console.log("rkey", roomKey, sessionRoomKey)
  console.log(roomKeyStatus && roleStatus)

  if (roomKeyStatus && roleStatus) return true;
  else throw new ShotzException(`You're not authorized to do this action!`, 401);
}

export function setSession(session, roomKey, role) {
  session.roomKey = roomKey;
  session.role = role;
}

export async function checkRoleAuthentication(sessionRole, role) {
  if (sessionRole === role) return true;
  else if (!sessionRole) throw new ShotzException(`No role found in your session!`, 404);
  else throw new ShotzException(`Try signing in as a different role!`, 401);
}

export async function checkNoActiveGame(session) {
  if(session.role || session.roomKey) {
    const game = await GameDAO.getGame(session.roomKey);
    if(game) throw new ShotzException('You are already active in an existing game', 400);
  }
  return true;
}
