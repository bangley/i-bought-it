import axios from 'axios'
import store from '../store'

/**
 * 후잉 유저 정보
 */
export const getWhooingSections = async function () {
  const url = 'https://whooing.com/api/sections.json_array'
  let key = store.getters.apiKey
  const res = await axios.get(url, {
    headers: {
      'X-API-KEY': key
    }
  })
  return res.data
}

// let sampleData = {
//   'code': 200,
//   'message': '',
//   'error_parameters': {},
//   'rest_of_api': 4988,
//   'results': [
//     {
//       'section_id': 's123',
//       'title': '유동성 자산',
//       'memo': '자주접근하는 자산만 관리',
//       'currency': 'KRW',
//       'isolation': 'n',
//       'total_assets': 2982799.00,
//       'total_liabilities': 23910.00,
//       'skin_id': 0,
//       'decimal_places': 2,
//       'date_format': 'YMD'
//     },
//     {
//       'section_id': 's283',
//       'title': '부동자산',
//       'memo': '규모가 큰 자산들',
//       'currency': 'KRW',
//       'isolation': 'n',
//       'total_assets': 1929882838.00,
//       'total_liabilities': 2328862.00,
//       'skin_id': 1,
//       'decimal_places': 2,
//       'date_format': 'YMD'
//     }
//   ]
// }
