<template>
  <div class="table-container">
    <div class="table-header">
      <button class="table-button" @click="goToOnlineBooking">線上訂票</button>
      <h2 class="table-title">票價總覽</h2>

      <table class="table-full table-bordered table-bg">
        <thead>
        <tr>
          <th class="table-cell-header">票種</th>
          <th class="table-cell-header">價格</th>
          <th class="table-cell-header">規定</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ticket in tickets" :key="ticket.type">
          <td class="table-cell">{{ ticket.type }}</td>
          <td class="table-cell">{{ ticket.price }}元</td>
          <td class="table-cell">
            <ul class="table-list">
              <li v-for="(rule, index) in ticket.rules" :key="index">
                {{ rule }}
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';

export default {
  name: 'TicketPurchase',
  setup() {
    const router = useRouter();

    function goToOnlineBooking() {
      router.push('/online-booking-system');
    }

    return {
      goToOnlineBooking
    };
  },
  data() {
    return {
      tickets: [
        {
          type: '全票',
          price: 300,
          rules: ['適用於年齡 18 至 64 歲的成人。']
        },
        {
          type: '敬老票',
          price: 130,
          rules: [
            '適用於65歲及以上的年長者。',
            '需提供有效的身分證明（如身分證、老人卡）以驗證年齡。'
          ]
        },
        {
          type: '兒童票',
          price: 150,
          rules: [
            '3歲以下或身高低於 90 公分的兒童免費入場。',
            '若兒童超過 11 歲但身高仍在 140 公分以下，仍可購買兒童票。',
            '必要狀況下需提供有效的身分證明（如健保卡、身分證）以驗證年齡。'
          ]
        }
      ]
    };
  }
}
</script>


<style>
.table-container {

  max-width: 50%;
  margin: 100px auto;
  padding: 1rem;
}

.table-header {

  text-align: center;
  margin-bottom: 1rem;
}

.table-button {
  padding: 0.8rem 1rem;
  background-color: #6b5b95;
  color: white;
  border: none;
  border-radius: 13px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.3rem; /* 設置字體大小 */

}

.table-title {
  font-size: 1.25rem; /* text-xl */
  margin-bottom: 1rem;
}

.table-full {
  width: 100%;
}

.table-bordered {
  border-collapse: collapse;
}

.table-bg {
  background-color: white;
}

.table-cell-header {
  font-size: 1.4rem; /* 設置字體大小 */
  background-color: #D9D9D9;
  border: 1px solid #151414;
  padding: 0.4rem;
  color: #6b5b95;
  width: 16%;
}

.table-cell {
  border: 1px solid #121111;
  padding: 0.75rem;
}

.table-list {
  list-style-type: disc;
  padding-left: 1rem;
}
</style>
