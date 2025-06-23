import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { APP_LINK } from "./constants/link_constant";
import { API_LINK } from "./constants/api_constant";
import { APPROVED, PENDING, REJECTED, TOKEN_SETTING } from "./constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const haveAnAccess = request.cookies.has(TOKEN_SETTING.TOKEN);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/stream") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  const isGuestRoute = [APP_LINK.AUTH.LOGIN, APP_LINK.AUTH.REGISTER].some(
    (route) => pathname.startsWith(route)
  );

  if (isGuestRoute && haveAnAccess) {
    console.log("redirect to dashboard");

    return NextResponse.redirect(
      new URL(APP_LINK.DASHBOARD.DEFAULT, request.url)
    );
  }

  const isProtectedRoute = [
    APP_LINK.DASHBOARD.DEFAULT,
    APP_LINK.VENDOR.REGISTER,
  ].some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !haveAnAccess) {
    console.log("redirect to login");
    return NextResponse.redirect(new URL(APP_LINK.HOME, request.url));
  }

  if (haveAnAccess) {
    const token = request.cookies.get(TOKEN_SETTING.TOKEN)?.value;
    const responseApi = await axios
      .get(`${process.env.NEXT_PUBLIC_API_LINK}${API_LINK.AUTH.CHECK}`, {
        headers: {
          Cookie: `${TOKEN_SETTING.TOKEN}=${token}`,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: any) => {
        const nextResponse = NextResponse.next();

        nextResponse.cookies.set(
          TOKEN_SETTING.USER,
          JSON.stringify(response.data.data.user)
        );

        if (pathname === APP_LINK.VENDOR.REGISTER) {
          if (
            [PENDING, REJECTED].includes(
              response.data.data.user.verification_status_organizer
            )
          ) {
            return NextResponse.redirect(
              new URL(APP_LINK.VENDOR.REQUESTS, request.url)
            );
          }

          if (
            response.data.data.user.verification_status_organizer === APPROVED
          ) {
            return NextResponse.redirect(
              new URL(APP_LINK.DASHBOARD.DEFAULT, request.url)
            );
          }
        }

        if (pathname === APP_LINK.DASHBOARD.DEFAULT) {
          if (
            [PENDING, REJECTED].includes(
              response.data.data.user.verification_status_organizer
            )
          ) {
            return NextResponse.redirect(
              new URL(APP_LINK.VENDOR.REQUESTS, request.url)
            );
          }
        }

        return nextResponse;
      })
      .catch((error: any) => {
        const nextResponse = NextResponse.redirect(
          new URL(APP_LINK.HOME, request.url)
        );
        nextResponse.cookies.delete(TOKEN_SETTING.TOKEN);
        nextResponse.cookies.delete(TOKEN_SETTING.USER);
        return nextResponse;
      });

    return responseApi;
  }

  return NextResponse.next();
}
