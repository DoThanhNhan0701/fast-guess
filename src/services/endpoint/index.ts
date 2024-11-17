const prefixAuth: string = '/api'
const prefixBase: string = '/api'
const prefixOther: string = '/api'

const endpointAuth = {
  LOGIN: `${prefixAuth}/auth/login/`,
  REGISTER: `${prefixAuth}/auth/register/`,
  VERIFI: `${prefixAuth}/auth/verify/`,
}

const endpointBase = {
  USER: `${prefixBase}/user`,
  GET_ME: `${prefixBase}/user/me/`,
  TEACHER_UPDATE: `${prefixBase}/teacher/update/`,
  CLASSROOM: `${prefixBase}/classroom`,
  GROUP: `${prefixBase}/group`,
  TEACHER: `${prefixBase}/teacher/`,
  PLAN_LIST: `${prefixBase}/plan/list/`,
  PLAN_CREATE: `${prefixBase}/plan/create/`,
  PLAN_DELETE: `${prefixBase}/plan/delete/`,
  LIB_BULK_CREATE: `${prefixBase}/lib/bulk_create/`,
  LIB_LIST_LIB: `${prefixBase}/lib/list_lib/`,

  PLAN: `${prefixBase}/plan/`,
}

const endpointOther = {
  UPLOAD_IMG: `${prefixOther}/upload`,
  TEST_AUTH: `${prefixAuth}`,
  TEST_BASE: `${prefixBase}`,
}
export { endpointAuth, endpointBase, endpointOther }
