import React, { useState } from 'react';

function Login() {
  return(
    <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: Inter, "Noto Sans", sans-serif;'>
      <div class="flex items-center bg-white p-4 pb-2 justify-between">
        <div class="text-[#111418] flex size-12 shrink-0 items-center" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </div>
      </div>
      <div class="@container">
        <div class="@[480px]:px-4 @[480px]:py-3">
          <div
            class="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-[218px]"
            style='background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/stability/e4f587b3-738c-4ab2-a2e1-4c270e58ed94.png");'
          >
            <div class="flex p-4"><p class="text-white tracking-light text-[28px] font-bold leading-tight">Welcome back</p></div>
          </div>
        </div>
      </div>
      <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label class="flex flex-col min-w-40 flex-1">
          <input
            placeholder="username"
            class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#637588] p-4 text-base font-normal leading-normal"
            value=""
          />
        </label>
      </div>
      <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label class="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Password"
            class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#637588] p-4 text-base font-normal leading-normal"
            value=""
          />
        </label>
      </div>
      <p class="text-[#637588] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline">Forgot password?</p>
      <div class="flex justify-center">
        <div class="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
          <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#1980e6] text-white text-base font-bold leading-normal tracking-[0.015em] w-full"
          >
            <span class="truncate">Log in</span>
          </button>
          <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-transparent text-[#111418] text-base font-bold leading-normal tracking-[0.015em] w-full"
          >
            <span class="truncate">New user? Sign Up</span>
          </button>
          <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f0f2f4] text-[#111418] text-base font-bold leading-normal tracking-[0.015em] w-full"
          >
            <span class="truncate">Register with Google</span>
          </button>
        </div>
      </div>
      <div class="h-5 bg-white"></div>
    </div>
  ); 
}
export default Login;