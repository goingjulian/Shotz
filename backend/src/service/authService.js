import ShotzException from "../exceptions/ShotzException";

export async function checkAuthentication(sessionRoomKey, sessionRole, roomKey, allowedRoles) {
  const roomKeyStatus = sessionRoomKey == roomKey;
  const roleStatus = allowedRoles.includes(sessionRole);

  console.log(roomKey);

  if (roomKeyStatus && roleStatus) return true;
  else throw new ShotzException(`You're not authorized to do this action!`, 401);
}

export function setSession(session, roomKey, role) {
  session.roomKey = roomKey;
  session.role = role;
}

export async function checkRoleAuthentication(sessionRole, role) {
  console.log('checkRoleAuthentication');

  if (sessionRole === role) return true;
  else if (!sessionRole) throw new ShotzException(`No role found in your session!`, 404);
  else throw new ShotzException(`Try signing in as a different role!`, 401);
}
