import React from "react";

const GroupCardComponent = ({
  handleDelete,
  handleDrop,
  handleEnroll,
  handleViewGroup,
  group,
  descriptionFrag,
  i,
  applier,
  owner,
}) => {
  return (
    <div className="card shadow">
      <div className="card-header py-3 text-bg-primary">
        <h5 className="card-title">{group.name}</h5>
      </div>
      <div className="card-body">
        <div className="card-text">
          {descriptionFrag.map((frag) => {
            i++;
            return <div key={i}>{frag}</div>;
          })}
        </div>
      </div>
      <table className="table">
        <tbody>
          {!owner && !applier && (
            <tr>
              <th>隊長</th>
              <td colSpan={3}>{group.owner.username}</td>
            </tr>
          )}
          <tr>
            <th>人數上限</th>
            <td>{group.amount}</td>
            <th>目前人數</th>
            <td>{group.members.length}</td>
          </tr>
        </tbody>
      </table>
      <div className="card-body d-flex gap-2 justify-content-center">
        <button
          value={group._id}
          className="btn btn-primary"
          onClick={handleViewGroup}
        >
          查看詳情
        </button>
        {!applier && (
          <>
            {owner && (
              <button
                name={group.name}
                onClick={handleDelete}
                value={group._id}
                className="btn btn-primary"
              >
                刪除
              </button>
            )}
            {!owner && (
              <button
                name={group.name}
                onClick={handleDrop}
                value={group._id}
                className="btn btn-primary"
              >
                退出
              </button>
            )}
          </>
        )}

        {applier && (
          <>
            {group.members.length < group.amount && (
              <button
                value={group._id}
                onClick={handleEnroll}
                className="btn btn-primary"
              >
                申請加入
              </button>
            )}
            {group.members.length >= group.amount && (
              <button className="btn btn-outline-primary disabled">
                目前已額滿
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupCardComponent;
