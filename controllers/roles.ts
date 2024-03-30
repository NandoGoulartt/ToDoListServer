import { USER_ROLES } from "../enum/roles";
import rolesModel from "../models/rolesModel";
import userRolesModel from "../models/userRolesModel";

export async function getRolesId(roles: string[]) {
  const rolesId: number[] = await Promise.all(
    roles.map(async (role: string) => {
      if (USER_ROLES.hasOwnProperty(role)) {
        const roleData = await rolesModel.findOne({ where: { name: role } });
        if (roleData) {
          return roleData?.dataValues.id;
        }
      }
      return undefined;
    })
  );

  return rolesId.filter((roleId) => roleId !== undefined) as number[];
}

export async function create(usersId: number, rolesId: number) {
  try {
    const existingUserRole = await userRolesModel.findOne({
      where: { user_id: usersId, role_id: rolesId },
    });

    if (existingUserRole) {
      return false;
    }

    await userRolesModel.create({ user_id: usersId, role_id: rolesId });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
