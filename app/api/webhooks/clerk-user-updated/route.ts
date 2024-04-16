"use server";

// {
//   data: {
//     backup_code_enabled: false,
//     banned: false,
//     create_organization_enabled: true,
//     created_at: 1712970969119,
//     delete_self_enabled: true,
//     email_addresses: [ [Object] ],
//     external_accounts: [ [Object] ],
//     external_id: null,
//     first_name: 'Marvin',
//     has_image: false,
//     id: 'user_2f1aJv5qrVcG8LBnKQ5ovmeTWOc',
//     image_url: 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZjBjZDBmQTlodnVEYXNHSlJGWFJJTVAxOU0iLCJyaWQiOiJ1c2VyXzJmMWFKdjVxclZjRzhMQm5LUTVvdm1lVFdPYyIsImluaXRpYWxzIjoiTUEifQ',
//     last_active_at: 1713226793236,
//     last_name: 'Arnold',
//     last_sign_in_at: 1713239138002,
//     locked: false,
//     lockout_expires_in_seconds: null,
//     object: 'user',
//     passkeys: [],
//     password_enabled: false,
//     phone_numbers: [],
//     primary_email_address_id: 'idn_2f1aJXRQv6oMs33QLSPyDj2T2X7',
//     primary_phone_number_id: null,
//     primary_web3_wallet_id: null,
//     private_metadata: {
//       lockerAddress: '0x614406B955aBD0797945badF3D8e890Ab85723Fb',
//       lockerSeed: '639875',
//       ownerAddress: '0xAF115955b028c145cE3A7367B25A274723C5104B'
//     },
//     profile_image_url: 'https://www.gravatar.com/avatar?d=mp',
//     public_metadata: {},
//     saml_accounts: [],
//     totp_enabled: false,
//     two_factor_enabled: false,
//     unsafe_metadata: {},
//     updated_at: 1713240571723,
//     username: null,
//     verification_attempts_remaining: 100,
//     web3_wallets: []
//   },
//   object: 'event',
//   type: 'user.updated'
// }
export async function POST(request: Request) {
  console.log("user-updated");

  const res = await request.json();
  const { lockerAddress } = res.data.private_metadata;
  console.log(lockerAddress);
  return Response.json({ done: true });
}
