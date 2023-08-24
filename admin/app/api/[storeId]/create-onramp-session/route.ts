import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const OnrampSessionResource = Stripe.StripeResource.extend({
	create: Stripe.StripeResource.method({
		method: 'POST',
		path: 'crypto/onramp_sessions',
	}),
});

const stripe = new Stripe('sk_test_51NXOHdARfU5KPLlVvSdDo9Y0zQXLkfS1vMj3AhYNU8A22W7rprb5YJTCDNfgaQeAl58yzZ8mMa3eBUD3EEWpdZiC00LD2YWcQA', {
  apiVersion: "2022-11-15"
});

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	const { transaction_details } = await req.json();

	let clientSecret = '';

	const apiKey =
		'pk_test_51N5TmzEC5zyE604b3qlKrdd1g56JR9th1aM2iTBDPuJiLmMC2nbwYcSiXahYi6QjNv2MhcM7hu4YZKc9zdILGxo600UGrmr0PQ';
	const url = 'https://api.stripe.com/v1/crypto/onramp_sessions';

	const requestData = new URLSearchParams();
	requestData.append('customer_ip_address', '8.8.8.8');
	requestData.append(
		'wallet_addresses[solana]',
		'2qjX4as5UsfHkjpwuoVgUCtySTHtE5SBZEbNs1MrP4rR'
	);
	requestData.append('destination_networks[]', 'solana');
	requestData.append('destination_currencies[]', 'usdc');
	requestData.append('destination_network', 'solana');
	requestData.append('destination_currency', 'usdc');
	requestData.append('destination_amount', '10');
	requestData.append(
		'wallet_addresses[ethereum]',
		'0xD8a9d08E189e81F4D02790D12c757e6c6a3C1c8b'
	);
	requestData.append('destination_networks[]', 'ethereum');
	requestData.append('destination_currencies[]', 'usdc');
	requestData.append('destination_network', 'ethereum');
	requestData.append('destination_currency', 'usdc');
	requestData.append('destination_amount', '10');

	const headers = {
		Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
		'Content-Type': 'application/x-www-form-urlencoded',
	};

	const requestOptions = {
		method: 'POST',
		headers: headers,
		body: requestData,
	};

	await fetch(url, requestOptions)
		.then((response) => response.json())
		.then((data) => {
			clientSecret = data.client_secret;
		})
		.catch((error) => {
			console.error('Error creating onramp session:', error);
		});

	return NextResponse.json(
		{
			clientSecret: clientSecret,
		},
		{
			headers: corsHeaders,
		}
	);
}
