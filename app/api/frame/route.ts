import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (message?.button === 2) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=farcaster&tbm=isch&ved=2ahUKEwiw7K_b15eEAxUn7gIHHVlYCrAQ2-cCegQIABAA&oq=farcaster&gs_lp=EgNpbWciCWZhcmNhc3RlcjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIHEAAYgAQYGDIHEAAYgAQYGDIHEAAYgAQYGDIHEAAYgAQYGEjaHlCIClj5E3AAeACQAQCYAUagAe0EqgECMTC4AQPIAQD4AQGKAgtnd3Mtd2l6LWltZ8ICChAAGIAEGIoFGEOIBgE&sclient=img&ei=OajCZfDrMKfci-gP2bCpgAs#imgrc=xdszH7LQminfPM',
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `🌲 Text: ${text}`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/park-2.png`,
      post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
