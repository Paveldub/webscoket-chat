import React from "react";

export const withSuspense = (WrappedComponent: any) => {
	return class extends React.Component {
		render() {
			return (
				<React.Suspense fallback={'loading...'}>
					<WrappedComponent {...this.props} />
				</React.Suspense>
			);
		}
	};
}