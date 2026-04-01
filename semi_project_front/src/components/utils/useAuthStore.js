import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    //새로고침하더라도 기억할 수 있도록 작업
    //사용할 변수 정리
    (set) => ({
      //저장할 정보 속성으로 생성
      memberId: null,
      memberGrade: null,
      memberThumb: null,
      token: null,
      endTime: null,
      isReady: false,

      //함수 구현(zustand로 관리할 데이터를 처리하는 함수들 구현)
      login: ({ memberId, memberGrade, memberThumb, token, endTime }) => {
        set({ memberId, memberGrade, memberThumb, token, endTime });
      },
      logout: () => {
        set({
          memberId: null,
          memberGrade: null,
          memberThumb: null,
          token: null,
          endTime: null,
        });
      },
      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
      },
    }),
    {
      name: "auth-key",
      storage: createJSONStorage(() => localStorage),
      //새로고침 해도 저장할 데이터를 선택
      //-> 6개 데이터 중 5개만 계속 저장하고 isReady는 새로고침 시 초기화하기 위한 설정
      //partialize를 설정하지 않으면 모든 정보를 브라우저에 계속 저장해서 유지
      partialize: (state) => {
        return {
          memberId: state.memberId,
          memberGrade: state.memberGrade,
          memberThumb: state.memberThumb,
          token: state.token,
          endTime: state.endTime,
        };
      },
    },
  ),
);

export default useAuthStore;
