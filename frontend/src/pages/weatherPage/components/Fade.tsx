import { Transition } from "react-transition-group";

interface Props {
    children: React.ReactNode;
    in: boolean;
    duration: number;
}

export const Fade = (props: Props) => {
    const { children, in: inProp, duration } = props;

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 1,
    };

    const transitionStyles: any = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
    };

    return (
        <Transition in={inProp} timeout={duration}>
            {(state) => (
                <svg
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}
                >
                    {children}
                </svg>
            )}
        </Transition>
    );
};
