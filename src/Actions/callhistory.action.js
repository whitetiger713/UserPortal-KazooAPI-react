import axios from 'axios'
import * as CONSTS from '../Constants'
import CONFIG from '../Config.json'

export const getCallFlow = (start, end) => {
  let startDate = new Date(start);
  let endDate = new Date(end);

  let start_year = startDate.getFullYear() + 1970;
  let start_month = startDate.getMonth();
  let start_date = startDate.getDate();

  let end_year = endDate.getFullYear() + 1970;
  let end_month = endDate.getMonth();
  let end_date = endDate.getDate();

  let start_timestamp = Math.round(new Date(start_year, start_month, start_date, 0, 0, 0, 0).getTime()) / 1000;
  let end_timestamp = Math.round(new Date(end_year, end_month, end_date, 23, 59, 59, 999).getTime()) / 1000;
  return (dispatch) => {
    dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: "Sending API request to get all data." });
    dispatch({ type: CONSTS.SENDING_API_REQUEST });

    const CALL_URI = `${CONFIG.API_VERSION}/accounts/${CONFIG.ACCOUNT_ID}/users/${CONFIG.OWNER_ID}/cdrs?created_from=${start_timestamp}&created_to=${end_timestamp}&paginate=false`;
    const username = `${CONFIG.API_VERSION}/accounts/${CONFIG.ACCOUNT_ID}/users/${CONFIG.OWNER_ID}`;
    axios.get(CALL_URI)
      .then((res) => {
        var call_data = res.data.data;
        axios.get(username)
        .then((res1) => {
          let full_name = res1.data.data.first_name +" "+ res1.data.data.last_name;
          var calldata = { call_data, full_name };
          dispatch({ type: CONSTS.GET_ALL_CALL_FLOW_ON_AN_ACCOUNT_SUCCESS, payload: calldata });
        })
      })
      .catch((error) => {
        if (typeof error !== 'undefined' && typeof error.response !== 'undefined' && error.response.status === 401) {
          dispatch({ type: CONSTS.SET_SYSTEMMESSAGE, payload: "Authentication failed." })
          dispatch({ type: CONSTS.RESET_AUTH_TOKEN })
        }
      })
  }
}
