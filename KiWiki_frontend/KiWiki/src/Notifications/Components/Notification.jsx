function Notification({ title, user, notifDate, notifType, read, onAccept, onDeny }) {
    return (
        <div
            className={`p-4 m-2 rounded shadow-md w-full max-w-xl ${
                read ? "bg-gray-300" : "bg-white"
            }`}
        >
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700 mb-1">User: {user}</p>
            <p className="text-gray-700 mb-1">
                Date: {new Date(notifDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">Type: {notifType}</p>
            <div className="flex justify-end mt-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                    onClick={onAccept}
                >
                    Aceptar
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={onDeny}
                >
                    Denegar
                </button>
            </div>
        </div>
    );
}

export default Notification;