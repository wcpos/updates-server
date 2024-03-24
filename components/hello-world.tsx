export function Component(properties: {message: string}) {
	return (
		<body>
			<h1>{properties.message}</h1>
		</body>
	);
}

export const HelloWorld = <Component message='Hello from server!' />;
