import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const { $config } = useNuxtApp();
  const { user } = storeToRefs(useAuth());

  const socket = reactive<Socket>(
    io(`${$config.public.serverEndpoint}`, {
      query: { userId: user.value._id },
    })
  );

  const listenSocketEvent = (
    event: string,
    callback: (...args: any[]) => void
  ) => {
    socket.on(event, callback);
  };

  const reconnectSocket = (userId: string) => {
    socket.disconnect();
    socket.io.opts.query = { userId };
    socket.connect();
  };

  const disconnectSocket = () => {
    socket.disconnect();
  };

  return { socket, listenSocketEvent, reconnectSocket, disconnectSocket };
};
